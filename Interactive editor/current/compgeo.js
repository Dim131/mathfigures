/* 
   Design philosophy: 
      Functions do not create any temporaty objects.
*/

class GPoint {
   constructor(x, y) {
      this.x = x;
      this.y = y;
   }
   
   /* Get the coordinates from the given point. */
   copy(other) {
      this.x = other.x;
      this.y = other.y;
   }
   
   /* Copies and returns if changed. */
   checkCopy(other) {
      let did_change = (this.x != other.x) || (this.y != other.y);
      this.x = other.x;
      this.y = other.y;
      return did_change;
   }
   
   /* Set both coordinates to zero. */
   zero() {
      this.x = this.y = 0.0;
   }
   
   setNan() {
      this.x = this.y = NaN;
   }
   
   /* Returns the distance from the origin. */
   length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
   }
};

const ZERO = new GPoint(0.0, 0.0);

function createGPoint(pt) {
   return new GPoint(pt.x, pt.y);
}

function sqr(x) { return x * x; }

function gminus(ans, p1, p2) {
   ans.x = p1.x - p2.x;
   ans.y = p1.y - p2.y;
}

function gadd(ans, p1, p2) {
   ans.x = p1.x + p2.x;
   ans.y = p1.y + p2.y;
}

function gmult(ans, p, s) {
   ans.x = p.x * s;
   ans.y = p.y * s;
}

function gdot(p1, p2) {
   return p1.x * p2.x + p1.y * p2.y;
}

function gdist(p, q) {
   return Math.sqrt(sqr(p.x - q.x) + sqr(p.y - q.y));
}

let temp1 = new GPoint(0.0,0.0),
    temp2 = new GPoint(0.0,0.0),
    temp3 = new GPoint(0.0,0.0);

function findCircumcenter(ans, p1, p2, p3) {
   gminus(temp1, p3, p2);
   let a = temp1.length();
   gminus(temp1, p1, p3);
   let b = temp1.length();
   gminus(temp1, p2, p1);
   let c = temp1.length();
   
   let t1 = sqr(a) * (sqr(b) + sqr(c) - sqr(a));
   let t2 = sqr(b) * (sqr(c) + sqr(a) - sqr(b));
   let t3 = sqr(c) * (sqr(a) + sqr(b) - sqr(c));
   let denom = t1 + t2 + t3;
   gmult(temp1, p1, t1/denom);
   gmult(temp2, p2, t2/denom);
   gmult(temp3, p3, t3/denom);
   ans.zero();
   gadd(ans, ans, temp1); 
   gadd(ans, ans, temp2);
   gadd(ans, ans, temp3);
}

function findProjection(ans, x, p1, p2) {
   gminus(temp1, p2, p1);
   gmult(temp3, temp1, 1.0/gdist(p1, p2));
   gminus(temp2, x, p1);
   let dt = gdot(temp2, temp3);
   gmult(temp1, temp3, dt);
   gadd(ans, p1, temp1);
}

function findAngleRect(ans, p1, p2, p3, ell) {
   ans[0].copy(p2);
   gminus(temp1, p1, p2);
   gmult(temp2, temp1, ell/gdist(p1, p2));
   gminus(temp1, p3, p2);
   gmult(temp3, temp1, ell/gdist(p3, p2));
   
   gadd(temp1, temp2, temp3);
   
   gadd(ans[1], p2, temp2);
   gadd(ans[2], p2, temp1);
   gadd(ans[3], p2, temp3);
}

function findAngle(ans, p1, p2, p3, ell) {
   ans[1].copy(p2);
   gminus(temp1, p1, p2);
   gmult(temp2, temp1, ell/gdist(p1, p2));
   gadd(ans[0], temp2, p2);
   
   gminus(temp1, p3, p2);
   gmult(temp2, temp1, ell/gdist(p3, p2));
   gadd(ans[2], temp2, p2);
}

function findAngleLabelPos(ans, p1, p2, p3, ell) {
   gminus(temp1, p1, p2);
   gmult(temp2, temp1, ell/gdist(p1, p2));
   
   gminus(temp1, p3, p2);
   gmult(temp3, temp1, ell/gdist(p3, p2));
   
   gadd(temp1, temp2, temp3);
   gmult(temp2, temp1, 0.5);
   gmult(temp1, temp2, ell / gdist(temp2, ZERO));
   gadd(ans, temp1, p2);
}

function findSlope(p1, p2) {
   return (p1.y - p2.y) / (p1.x - p2.x);
}

function findIntercept(m, p1, p2) {
   return -m * p1.x + p1.y;
}

function findIntersection(ans, p1, p2, p3, p4) {
   if (p1.x == p2.x) {
      if (p3.x == p4.x) ans.setNan();
      findIntersection(ans, p3, p4, p1, p2);
   } 
   let m1 = findSlope(p1, p2);
   let c1 = findIntercept(m1, p1, p2);
   if (p3.x == p4.x) return m1 * p3.x + c1;
   
   let m2 = findSlope(p3, p4);
   let c2 = findIntercept(m2, p3, p4);
   ans.x = -(c1 - c2) / (m1 - m2);
   ans.y = m1 * ans.x + c1;
}
