module.exports = (bot) => {
  const prompt = process.openStdin();
  prompt.addListener('data', (res) => {
    const x = res.toString().trim().split(/ +/g);
    bot.channels.get('555039958121971736').send(x.join(' '));
  });
};
