'use strict';

/**
 * Convert a series of points to a CatmullRom spline
 * https://github.com/yr/catmull-rom-spline
 * @copyright Yr
 * @license MIT
 */


/**
 * Convert 'points' to catmull rom bezier spline
 * @param {Array} points
 * @returns {Array}
 */

function smooth2 (_points, times = 1) {
  var n = _points.length;
  var p0 = _points[0];
  var p1 = _points[0];
  var p2 = _points[1];
  var p3 = _points[2];
  var pts = [_points[0]];

  for (var i = 1; i < n; i++) {
    pts.push([(-p0[0] + 6 * p1[0] + p2[0]) / 6, (-p0[1] + 6 * p1[1] + p2[1]) / 6, (p1[0] + 6 * p2[0] - p3[0]) / 6, (p1[1] + 6 * p2[1] - p3[1]) / 6, p2[0], p2[1]]);

    p0 = p1;
    p1 = p2;
    p2 = p3;
    p3 = _points[i + 2] || p3;
  }

  let all = pts.reduce((arr, points) => arr.concat(points), [])
  let res = [];
  for (var i = 0; i < all.length; i += 2) {
    res.push(all.slice(i, i + 2));
  }
  return res
}
/**
 * Slice out a segment of 'points'
 * @param {Array} points
 * @param {Number} start
 * @param {Number} end
 * @returns {Array}
 */
function slice (points, start, end) {
  var pts = points.slice(start, end);

  // Remove control points for 'M'
  if (start) pts[0] = pts[0].slice(-2);

  return pts;
}


