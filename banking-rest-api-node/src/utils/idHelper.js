async function getNextId(Model) {
  const latest = await Model.findOne().sort({ id: -1 }).select("id").lean();
  return latest ? latest.id + 1 : 1;
}

module.exports = {
  getNextId,
};
