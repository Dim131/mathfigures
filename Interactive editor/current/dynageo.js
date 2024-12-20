
/* TODO: Consider moving the renderer outside of here. */
class BaseUnit {
   constructor(deps, is_moveable, props) {
      this.id = '';
      this.deps = deps;
      this.is_moveable = is_moveable;
      this.has_init = false;
      this.props = props;
   }
   
   eval() { }
   
   rst() {
      this.id = '';
      this.has_init = false;
   }
   
   init(instance) {
      if (this.has_init) return true;
      for (let i = 0; i < this.deps.length; ++i) {
         this.deps[i].init(instance);
      }
      this.has_init = true;
      this.id = instance.getNextShapeId();
      instance.id_to_shape[this.id] = this;
      return false;
   } 
   
   shiftBy(seen, dx, dy) {
      if (this.id in seen) return;
      seen[this.id] = true;
      for (let i = 0; i < this.deps.length; ++i) {
         this.deps[i].shiftBy(seen, dx, dy);
      }
   }
   
   sync() { }
   
   getDeps() { return this.deps; }
   
   isMoveable() {
      return this.is_moveable;
   }
   
   toJson() {
      let dep_ids = [];
      for (let i = 0; i < this.deps.length; ++i) {
         dep_ids.push(this.deps[i].id);
      }
      return {
         "id": this.id,
         "type": this.constructor.name,
         "deps": dep_ids,
         "props": this.props
      };
   }
   
   getName() {
      return this.constructor.name;
   }
}

class ConstVal extends BaseUnit {
   
   constructor(props) {
      super([], /* is_moveable= */ false, props);
      this.val = props.val;
   }
   
   getName() {
      return this.constructor.name + "(" + this.props.val + ")";
   }
};

class RangeVal extends BaseUnit {
   
   constructor(props) {
      super([], /* is_moveable= */ false, props);
      this.val = props.val;
      this.min_val = props.min_val;
      this.max_val = props.max_val;
   }
   
   init(instance) {
      if (super.init(instance)) return;
      let slider_id = "slider_" + this.id;
      let slider_container = document.getElementById("slidecontainer");
      slider_container.innerHTML = "<input type='range' min='" + this.min_val + "' max='" + this.max_val + "' value='" + this.val + "' id='" + slider_id + "'>";
      slider_container.addEventListener("input", (event) => {
         let slider = document.getElementById(slider_id);
         this.val = slider.value;
         instance.syncAll();
      });
   }
   
};

class CoordinateVal extends BaseUnit {
   
   constructor(props) {
      super([], /* is_moveable= */ false, props);
      this.val = props.val;
   }
   
   shiftBy(seen, dx, dy) {
      super.shiftBy(seen, dx, dy);
      this.val += dx;
      this.props.val = this.val;
   }
   
   getName() {
      return this.constructor.name + "(" + this.val + ")";
   }
};

const COLOR_TYPE = "COLOR_TYPE";
const SIZE_TYPE = "SIZE_TYPE";
const TEXT_TYPE = "TEXT_TYPE";
const POSITION_TYPE = "POSITION_TYPE";
const INTERVALS_TYPE = "POSITION_TYPE";

const POINT_PROPS = {
   "stroke_color": COLOR_TYPE,
   "size": SIZE_TYPE,
   "show": INTERVALS_TYPE
};

class Point extends BaseUnit {
   
   static PROPS = POINT_PROPS;
   
   constructor(x, y, props) {
      super([x,y], true, props);
      this.X = x;
      this.Y = y;
      this.gp = new GPoint(0, 0);
   }
   
   eval() {
      this.gp.x = this.X.val;
      this.gp.y = this.Y.val;
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderPoint(this.id, this.gp, this.props);
   }
   
   shiftBy(seen, dx, dy) {
      if (this.id in seen) return;
      seen[this.id] = true;
      this.X.shiftBy(seen, dx);
      this.Y.shiftBy(seen, dy);
   }
   
   /* Assumes all parents are up-to-date. */
   sync(instance) {
      this.eval();
      instance.updatePoint(this.id, this.gp, this.props);
   }
   
   getName() {
      return this.constructor.name;
   }
};

class Midpoint extends BaseUnit {
   
   static PROPS = POINT_PROPS;
   
   constructor(pt1, pt2, props) {
      super([pt1, pt2], true, props);
      this.pt1 = pt1;
      this.pt2 = pt2;
      this.gp = new GPoint(0.0, 0.0);
   }
   
   eval() {
      this.gp.x = (this.pt1.gp.x + this.pt2.gp.x) / 2;
      this.gp.y = (this.pt1.gp.y + this.pt2.gp.y) / 2;
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderPoint(this.id, this.gp, this.props);
   }
   
   sync(instance) {
      this.eval(false);
      instance.updatePoint(this.id, this.gp, this.props);
   }

};

class Projection extends BaseUnit {
   
   static PROPS = POINT_PROPS;
   
   constructor(pt1, pt2, pt3, props) {
      super([pt1, pt2, pt3], true, props);
      this.pt1 = pt1;
      this.pt2 = pt2;
      this.pt3 = pt3;
      this.gp = new GPoint(0.0, 0.0);
   }
   
   eval() {
      findProjection(this.gp, this.pt1.gp, this.pt2.gp, this.pt3.gp);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderPoint(this.id, this.gp, this.props);
   }
   
   sync(instance) {
      this.eval(false);
      instance.updatePoint(this.id, this.gp, this.props);
   }
};


class Segment extends BaseUnit {
   static PROPS = {
      "stroke_color": COLOR_TYPE,
      "line_width": SIZE_TYPE,
      "dasharray" : SIZE_TYPE, // TODO: Create a custom type here.
      "show": INTERVALS_TYPE
   };
   
   constructor(pt1, pt2, props) {
      super([pt1, pt2], true, props);
      this.pt1 = pt1;
      this.pt2 = pt2;
      this.gp1 = new GPoint(0.0,0.0);
      this.gp2 = new GPoint(0.0,0.0);
   }
   
   eval() {
      this.gp1.copy(this.pt1.gp);
      this.gp2.copy(this.pt2.gp);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderSegment(this.id, this.gp1, this.gp2, this.props);
   }
   
   sync(instance) {
      this.eval();
      instance.updateSegment(this.id, this.gp1, this.gp2, this.props);
   }
};

class Polygon extends BaseUnit {
   
   static PROPS = {
      "stroke_color": COLOR_TYPE,
      "fill_color": COLOR_TYPE,
      "line_width": SIZE_TYPE,
      "show": INTERVALS_TYPE
   };
   
   constructor(pts, props) {
      super(pts, true, props);
      this.pts = pts;
      this.pts_str = "";
      this.gps = [];
      for (let i = 0; i < pts.length; ++i) this.gps.push(new GPoint(0.0,0.0));
   }
   
   eval() {
      let did_change = false;
      for (let i = 0; i < this.pts.length; ++i) {
         did_change = this.gps[i].checkCopy(this.pts[i].gp) || did_change;
      }
      return did_change;
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.perimeter_id = this.id + "_perimeter";
      this.area_id = this.id + "_area";
      this.eval();
      this.pts_str = "";
      for (let i = 0; i < this.pts.length; ++i) {
         this.pts_str += this.gps[i].x + "," + this.gps[i].y + " ";
      }
      instance.renderPolygon(this.id, this.perimeter_id, this.area_id, this.pts_str, this.props, 0);
   }
   
   /* Assumes all parents are up-to-date. */
   sync(instance) {
      if (this.eval()) {
         this.pts_str = "";
         for (let i = 0; i < this.pts.length; ++i) {
            this.pts_str += this.gps[i].x + "," + this.gps[i].y + " ";
         }
      }
      instance.updatePolygon(this.perimeter_id, this.area_id, this.pts_str, this.props);
   }
};

class Centroid extends BaseUnit {
   static PROPS = POINT_PROPS;
   
   constructor(poly, props) {
      super([poly], true, props);
      this.poly = poly;
      this.gp = new GPoint(0.0,0.0);
   }
   
   eval() {
      let xx = 0.0;
      let yy = 0.0;
      for (let i = 0; i < this.poly.gps.length; ++i) {
         xx += parseFloat(this.poly.gps[i].x);
         yy += parseFloat(this.poly.gps[i].y);
      }
      this.gp.x = xx / this.poly.gps.length;
      this.gp.y = yy / this.poly.gps.length;
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderPoint(this.id, this.gp, this.props);
   }
   
   sync(instance) {
      this.eval();
      instance.updatePoint(this.id, this.gp, this.props);
   }
};


class Circle extends BaseUnit {
   static PROPS = {
      "stroke_color": COLOR_TYPE,
      "fill_color": COLOR_TYPE,
      "line_width": SIZE_TYPE,
      "dasharray" : SIZE_TYPE, // TODO: Create a custom type here.
      "show": INTERVALS_TYPE
   };
   constructor(pt, radius, props) {
      super([pt, radius], true, props);
      this.pt = pt;
      this.gp = new GPoint(0, 0);
      this.radius = radius;
      this.radius_val = 0;
   }
   
   eval() {
      this.gp.copy(this.pt.gp);
      this.radius_val = this.radius.val;
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderCircle(this.id, this.gp, this.radius_val, this.props);
   }
   
   sync(instance) {
      this.eval();
      instance.updateCircle(this.id, this.gp, this.radius_val, this.props);
   }
};


class CircleThroughPoint extends BaseUnit {
   static PROPS = Circle.PROPS;
   
   constructor(ct, pt, props) {
      super([ct, pt], true, props);
      this.ct = ct;
      this.pt = pt;
      this.radius_val = 0.0;
      this.gct = new GPoint(0, 0);
      this.gpt = new GPoint(0, 0);
   }
   
   eval() {
      this.gct.copy(this.ct.gp);
      this.gpt.copy(this.pt.gp);
      this.radius_val = gdist(this.gpt, this.gct);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderCircle(this.id, this.gct, this.radius_val, this.props);
   }
   
   sync(instance) {
      this.eval();
      instance.updateCircle(this.id, this.gct, this.radius_val, this.props);
   }
};


class Circumcenter extends BaseUnit {
   
   static PROPS = POINT_PROPS;
   
   constructor(p1, p2, p3, props) {
      super([p1, p2, p3], true, props);
      this.pt1 = p1;
      this.pt2 = p2;
      this.pt3 = p3;
      this.gp = new GPoint(0.0, 0.0);
      this.gp1 = new GPoint(0.0, 0.0);
      this.gp2 = new GPoint(0.0, 0.0);
      this.gp3 = new GPoint(0.0, 0.0);
   }
   
   eval() {
      this.gp1.copy(this.pt1.gp);
      this.gp2.copy(this.pt2.gp);
      this.gp3.copy(this.pt3.gp);
      findCircumcenter(this.gp, this.gp1, this.gp2, this.gp3);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderPoint(this.id, this.gp, this.props);
   }
   
   sync(instance) {
      this.eval();
      instance.updatePoint(this.id, this.gp, this.props);
   }
};

class LabelPoint extends BaseUnit {
   
   static PROPS = {
      "color": COLOR_TYPE,
      "text": TEXT_TYPE,
      "position": POSITION_TYPE,
      "offset": SIZE_TYPE,
      "offset_x": SIZE_TYPE,
      "offset_y": SIZE_TYPE,
      "show": INTERVALS_TYPE
   };
   
   constructor(p, props) {
      super([p], true, props);
      this.pt = p;
      this.gp = new GPoint(0.0, 0.0);
   }
   
   eval() {
      this.gp.copy(this.pt.gp);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderText(this.id, this.gp, this.props);
   }
   
   sync(instance) {
      this.eval();
      instance.updateText(this.id, this.gp, this.props);
   }
   
   getName() {
      return this.constructor.name + "(" + this.props.text + ")";
   }
};

class MarkRightAngle extends BaseUnit {
   
   static PROPS = {
      "stroke_color": COLOR_TYPE,
      "fill_color": COLOR_TYPE,
      "line_width": SIZE_TYPE,
      "ell": SIZE_TYPE,
      "show": INTERVALS_TYPE
   };
   
   constructor(p1, p2, p3, props) {
      super([p1, p2, p3], true, props);
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.pts_str = "";
      this.gps = [new GPoint(0.0,0.0), new GPoint(0.0,0.0), new GPoint(0.0,0.0),new GPoint(0.0,0.0)];
   }
   
   eval() {
      findAngleRect(this.gps, this.p1.gp, this.p2.gp, this.p3.gp, this.props.ell);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.perimeter_id = this.id + "_perimeter";
      this.area_id = this.id + "_area";
      this.eval();
      this.pts_str = "";
      for (let i = 0; i < this.gps.length; ++i) {
         this.pts_str += this.gps[i].x + "," + this.gps[i].y + " ";
      }
      instance.renderPolygon(this.id, this.perimeter_id, this.area_id, this.pts_str, this.props, -2);
   }
   
   /* Assumes all parents are up-to-date. */
   sync(instance) {
      this.pts_str = "";
      this.eval();
      for (let i = 0; i < this.gps.length; ++i) {
         this.pts_str += this.gps[i].x + "," + this.gps[i].y + " ";
      }
      instance.updatePolygon(this.perimeter_id, this.area_id, this.pts_str, this.props);
   }
};

class MarkAngle extends BaseUnit {
   
   static PROPS = {
      "stroke_color": COLOR_TYPE,
      "fill_color": COLOR_TYPE,
      "line_width": SIZE_TYPE,
      "ell": SIZE_TYPE,
      "show": INTERVALS_TYPE
   };
   
   constructor(p1, p2, p3, props) {
      super([p1, p2, p3], true, props);
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.gps = [new GPoint(0.0,0.0), new GPoint(0.0,0.0), new GPoint(0.0,0.0),new GPoint(0.0,0.0)];
   }
   
   eval() {
      findAngle(this.gps, this.p1.gp, this.p2.gp, this.p3.gp, this.props.ell);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.triangle_id = this.id + "_triangle";
      this.circ_segment_id = this.id + "_circ_segment";
      this.eval();
      // instance.renderPoint(-2, this.gps[2], this.props);
      // instance.renderPoint(-2, this.gps[0], this.props);
      instance.renderSector(this.id, this.triangle_id, this.circ_segment_id, this.gps[1], this.gps[0], this.gps[2], this.props);
   }
   
   /* Assumes all parents are up-to-date. */
   sync(instance) {
      this.eval();
      instance.updateSector(this.id, this.triangle_id, this.circ_segment_id, this.gps[1], this.gps[0], this.gps[2], this.props);
   }
};

class LabelAngle extends BaseUnit {
   
   static PROPS = {
      "color": COLOR_TYPE,
      "text": TEXT_TYPE,
      "ell": SIZE_TYPE,
      "show": INTERVALS_TYPE
   };
   
   constructor(p1, p2, p3, props) {
      super([p1, p2, p3], true, props);
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.gp = new GPoint(0.0, 0.0);
   }
   
   eval() {
      findAngleLabelPos(this.gp, this.p1.gp, this.p2.gp, this.p3.gp, this.props.ell);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderText(this.id, this.gp, this.props);
   }
   
   sync(instance) {
      this.eval();
      instance.updateText(this.id, this.gp, this.props);
   }
   
   getName() {
      return this.constructor.name + "(" + this.props.text + ")";
   }
};

class LineLineIntersection extends BaseUnit {
   
   static PROPS = POINT_PROPS;
   
   constructor(s1, s2, props) {
      super([s1, s2], true, props);
      this.s1 = s1;
      this.s2 = s2;
      this.gp = new GPoint(0.0, 0.0);
   }
   
   eval() {
      findIntersection(this.gp, this.s1.gp1, this.s1.gp2, this.s2.gp1, this.s2.gp2);
   }
   
   init(instance) {
      if (super.init(instance)) return;
      this.eval();
      instance.renderPoint(this.id, this.gp, this.props);
   }
   
   sync(instance) {
      this.eval(false);
      instance.updatePoint(this.id, this.gp, this.props);
   }
};

function constructObj(json_obj, objs, id_to_obj) {
   // Convert dep strings to deps. 
   let deps = [];
   for (let i = 0; i < json_obj["deps"].length; ++i) {
      deps.push(id_to_obj[json_obj["deps"][i]]);
   }
   
   const type = json_obj["type"];
   const props = json_obj["props"];
   let obj = null;
   if (type == "ConstVal") obj = new ConstVal(props);
   if (type == "RangeVal") obj = new RangeVal(props);
   if (type == "CoordinateVal") obj = new CoordinateVal(props);
   if (type == "Point") obj = new Point(deps[0], deps[1], props);
   if (type == "Midpoint") obj = new Midpoint(deps[0], deps[1], props);
   if (type == "Projection") obj = new Projection(deps[0], deps[1], deps[2], props);
   if (type == "Segment") obj = new Segment(deps[0], deps[1], props);
   if (type == "Polygon") obj = new Polygon(deps, props);
   if (type == "Centroid") obj = new Centroid(deps, props);
   if (type == "Circle") obj = new Circle(deps[0], deps[1], props);
   if (type == "CircleThroughPoint") obj = new CircleThroughPoint(deps[0], deps[1], props);
   if (type == "Circumcenter") obj = new Circumcenter(deps[0], deps[1], deps[2], props);
   if (type == "LabelPoint") obj = new LabelPoint(deps[0], props);
   
   if (type == "MarkRightAngle") obj = new MarkRightAngle(deps[0], deps[1], deps[2], props);
   if (type == "MarkAngle") obj = new MarkAngle(deps[0], deps[1], deps[2], props);
   if (type == "LabelAngle") obj = new LabelAngle(deps[0], deps[1], deps[2], props);
   if (type == "LineLineIntersection") obj = new LineLineIntersection(deps[0], deps[1], props);
   
   objs.push(obj);
   id_to_obj[json_obj["id"]] = obj;
   
}

/* Default props for the various geometric objects. */
function get_point_props() {
   return {"stroke_color": "black", "size": 5, "show": "*" };
}
function get_segment_props() {
   return {"stroke_color": "black", "line_width": 2, "dasharray": "0", "show": "*" };
}
function get_dashed_segment_props() {
   return {"stroke_color": "black", "line_width": 2, "dasharray": "4", "show": "*" };
}
function get_polygon_props() {
   return {"stroke_color": "#993300", "fill_color": "white", "line_width": 3, "show": "*" };
}
function get_hidden_polygon_props() {
   return {"stroke_color": "none", "fill_color": "none", "line_width": 3, "show": "*" };
}
function get_shaded_polygon_props() {
   return {"stroke_color": "black", "fill_color": "#f4eae5", "line_width": 3, "show": "*" };
}
function get_circle_props() {
   return {"stroke_color": "black", "fill_color": "none", "line_width": 2, "dasharray": "0", "show": "*" };
}
function get_right_angle_props() {
   return {"stroke_color": "green", "fill_color": "#b8d9b0", "line_width": 2, "ell": 10, "show": "*" };
}
function get_angle_props() {
   return {"stroke_color": "green", "fill_color": "#b8d9b0", "line_width": 2, "ell": 20, "show": "*" };
}

function addShow(props, time) {
   props["show"] = time;
   return props;
}

