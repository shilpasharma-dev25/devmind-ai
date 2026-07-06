const ErrorModel = require("../models/Error");

const getWeeklyReport = async (req, res) => {
  try {
    // Last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Total errors (last 7 days)
    const totalErrors = await ErrorModel.countDocuments({
      createdAt: {
        $gte: lastWeek,
      },
    });

    // Solved (last 7 days)
    const solved = await ErrorModel.countDocuments({
      status: "Solved",
      createdAt: {
        $gte: lastWeek,
      },
    });

    // Pending (last 7 days)
    const pending = await ErrorModel.countDocuments({
      status: "Pending",
      createdAt: {
        $gte: lastWeek,
      },
    });

    // Top 5 Technologies (last 7 days)
    const topTechnologies = await ErrorModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastWeek,
          },
        },
      },
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
      {
        $limit: 5,
      },
    ]);

    // Most Common Error Message (last 7 days)
    const mostCommonError = await ErrorModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastWeek,
          },
        },
      },
      {
        $group: {
          _id: "$errorMessage",
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
          mostCommonError.length > 0 ? mostCommonError[0] : null,
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