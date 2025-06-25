import Creator from '../models/Creator.js';

export const apply = async (req, res) => {
  try {
    const creator = new Creator(req.body);
    await creator.save();
    res.status(201).json({ message: 'Creator registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
