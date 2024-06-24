const abusiveWords = ['badword1', 'badword2', 'badword3']; // Add your list of abusive words here

const filterContent = (req, res, next) => {
  const { text } = req.body;
  if (text) {
    const words = text.split(' ');
    for (let word of words) {
      if (abusiveWords.includes(word.toLowerCase())) {
        return res.status(400).json({ message: 'Abusive or hateful content detected' });
      }
    }
  }
  next();
};

export default filterContent;
