const express = require("express");
const con = require("../config/db");

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  con.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "School added successfully",
        schoolId: result.insertId
      });
    }
  });
};

exports.listSchools = (req, res) => {
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      success: false,
      message: "Latitude and Longitude are required and must be valid numbers",
    });
  }

  const query = "select * from schools";
  con.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    const sortedSchools = results.map((school) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        school.latitude,
        school.longitude,
      );
      return {
        ...school,
        distance: distance.toFixed(2) + " KM",
      };
    });

    sortedSchools.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance),
    );
    return res.status(200).json({
      success: true,
      schools: sortedSchools,
    });
  });
};
