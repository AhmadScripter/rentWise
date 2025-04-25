const sendMail = require('../utils/mailer');

exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await sendMail(name, email, message);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Error sending mail:', err);
    res.status(500).json({ error: 'Email could not be sent.' });
  }
};