const sala_zasoby = require("../db_apis/sala_zasoby.js");

async function get(req, res, next) {
  try {
    const context = {};
    context.id = parseInt(req.params.id, 10);
    const rows = await sala_zasoby.find(context);
    if (rows.length === 0) {
      res.status(404).end();
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;
