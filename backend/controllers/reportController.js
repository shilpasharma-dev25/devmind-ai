const ErrorModel = require("../models/Error");

const getWeeklyReport = async (req, res) => {
  try {
    // Total errors
    const totalErrors = await ErrorModel.countDocuments();

    // Solved
    const solved = await ErrorModel.countDocuments({
      status: "Solved",
    });

    // Pending
    const pending = await ErrorModel.countDocuments({
      status: "Pending",
    });

    // Top Technologies
    const topTechnologies = await ErrorModel.aggregate([
      {
        $group: {
          _id: "$technology",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // Most Common Error Title
    const mostCommonError = await ErrorModel.aggregate([
      {
        $group: {
          _id: "$title",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    res.status(200).json({
      success: true,

      data: {
        totalErrors,

        solved,

        pending,

        topTechnologies,

        mostCommonError:
          mostCommonError.length > 0
            ? mostCommonError[0]
            : null,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getWeeklyReport,
};