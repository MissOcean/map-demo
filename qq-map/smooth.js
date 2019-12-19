/**
 * 三阶贝塞尔曲线
 * B(t) = P0 * (1-t)^3 + 3 * P1 * t * (1-t)^2 + 3 * P2 * t^2 * (1-t) + P3 * t^3, t ∈ [0,1]
 * @param t 曲线长度比例
 * @param p0 起始点
 * @param p1 控制点1
 * @param p2 控制点2
 * @param p3 终止点
 * @return t对应的点
 */
function calcBezierPoint (t, p0, p1, p2, p3) {
  let temp = 1 - t
  let x = p0.x * temp * temp * temp + 3 * p1.x * t * temp * temp + 3 * p2.x * t * t * temp + p3.x * t * t * t
  let y = p0.y * temp * temp * temp + 3 * p1.y * t * temp * temp + 3 * p2.y * t * t * temp + p3.y * t * t * t
  return { x, y }
}
function calcBezierOptions (points, scale) {
  //控制点收缩系数 ，经调试0.6较好
  scale = scale || 0.6
  let l = points.length

  // 计算中点
  let midPoints = points.map((point, i) => {
    let start = point
    let end = points[(i + 1) % l]
    return {
      x: (start.x + end.x) / 2.0,
      y: (start.y + end.y) / 2.0
    }
  })

  // 平移中点获取控制点
  let controlPointsOnPonit = midPoints.map((mid, i) => {
    let prevMid = midPoints[(i + l - 1) % l]
    let midInMid = {
      x: (mid.x + prevMid.x) / 2.0,
      y: (mid.y + prevMid.y) / 2.0
    }
    // 平移的距离
    let offsetX = points[i].x - midInMid.x
    let offsetY = points[i].y - midInMid.y
    let controlPoints = [
      // 上一个中点和当前中点平移后 ，作为过该点上的两个控制点
      {
        x: prevMid.x + offsetX,
        y: prevMid.y + offsetY
      },
      {
        x: mid.x + offsetX,
        y: mid.y + offsetY
      }
    ]

    // scale缩放
    controlPoints.forEach(item => {
      let scaleOffsetX = (item.x - points[i].x) * scale
      let scaleOffsetY = (item.y - points[i].y) * scale
      item.x = points[i].x + scaleOffsetX
      item.y = points[i].y + scaleOffsetY
    })
    return controlPoints
  })
  let bezierOptions = points.map((point, i) => {
    let start = point
    let end = points[(i + 1) % l]
    let c1 = controlPointsOnPonit[i][1]
    let c2 = controlPointsOnPonit[(i + 1) % l][0]
    return [start, c1, c2, end]
  })
  return bezierOptions
}

function samplingBezierPoints (bezierOption, interval = 0.2) {
  let points = []
  let t = 0
  while (t <= 1) {
    let point = calcBezierPoint(t, ...bezierOption)
    points.push(point)
    t += interval
  }
  // 补终点 
  if (t > 1) points.push(calcBezierPoint(1, ...bezierOption))
  return points
}

function smooth (points, scale, interval, close = true) {
  let bezierOptions = calcBezierOptions(points, scale)
  if (!close) bezierOptions.pop()
  return bezierOptions.map(option => samplingBezierPoints(option, interval)).flat()
}