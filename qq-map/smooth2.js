// Catmull-Rom样条曲线p1,p2函数 t[0,1]
function catmullRomFun (t, p0, p1, p2, p3) {
  return (t * ((2 - t) * t - 1) * p0 +
    (t * t * (3 * t - 5) + 2) * p1 +
    t * ((4 - 3 * t) * t + 1) * p2 +
    (t - 1) * t * t * p3
  ) / 2
}
// start-end延长线上取点，
function getExtendPoint (start, end, offsetScale) {
  let x = end[0] + end[0] - start[0]
  let y = end[1] + end[1] - start[1]
  return [x * offsetScale, y * offsetScale]
}
// 为了使首尾两段线更有弧度，虚拟点稍微偏移一点
function smooth2 (points, interval = 0.1, offsetScale = 1.0005) {
  let l = points.length
  if (l < 2) return points
  // 首尾使用虚拟点
  let prepend = getExtendPoint(points[1], points[0], offsetScale)
  let append = getExtendPoint(points[l - 2], points[l - 1], offsetScale)
  let curves = []
  // debugger
  for (let i = 0; i < points.length - 1; i++) {
    let p0 = points[i - 1] || prepend
    let p1 = points[i]
    let p2 = points[i + 1]
    let p3 = points[i + 2] || append
    let t = 0, curveSegment = []
    while (t < 1) {
      curveSegment.push([
        catmullRomFun(t, p0[0], p1[0], p2[0], p3[0]),
        catmullRomFun(t, p0[1], p1[1], p2[1], p3[1]),
      ])
      t += interval
    }
    curves.push(curveSegment)
  }
  console.log(11, curves)
  let fullCurve = curves.reduce((res, curve) => res.concat(curve), [])
  // 追加尾点
  fullCurve.push(points[l - 1])
  console.log(222, fullCurve)
  return fullCurve
}
