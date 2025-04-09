const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const { isAuthenticated, isMember, isAdmin, filterUserData } = require('../middleware/auth');

// Validation middleware
const validateMessage = [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('text').trim().isLength({ min: 1 })
];

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{
        association: 'author',
        attributes: ['id', 'firstName', 'lastName', 'membershipStatus']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Filter messages based on user's membership status
    const processedMessages = messages.map(message => {
      const msg = message.toJSON();
      if (!req.user || req.user.membershipStatus === 'regular') {
        // Hide author details for non-members
        msg.author = { id: msg.author.id, membershipStatus: msg.author.membershipStatus };
      }
      return msg;
    });

    res.json(processedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Create new message
router.post('/', isAuthenticated, validateMessage, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, text } = req.body;
    const message = await Message.create({
      title,
      text,
      userId: req.user.id
    });

    // Fetch the created message with author details
    const messageWithAuthor = await Message.findByPk(message.id, {
      include: [{
        association: 'author',
        attributes: ['id', 'firstName', 'lastName', 'membershipStatus']
      }]
    });

    const processedMessage = messageWithAuthor.toJSON();
    if (!req.user || req.user.membershipStatus === 'regular') {
      processedMessage.author = {
        id: processedMessage.author.id,
        membershipStatus: processedMessage.author.membershipStatus
      };
    }

    res.status(201).json(processedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error creating message' });
  }
});

// Delete message (admin only)
router.delete('/:messageId', isAdmin, async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
});

module.exports = router;