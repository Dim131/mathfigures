var transitions = {
  1 : [
    show("step1"),
    show("ABC"),
    show("ABCfill"),
  ],
  2 : [
    show("step2"),
    hide("ABCfill"),
  ],
  3 : [
    show("step3"),
  ],
  4 : [
    show("step4"),
    show("epsa"),
  ],
  5 : [
    show("step5"),
    show("epsb"),
    show("epsc"),
  ],
  6 : [
    show("step6"),
    show("KLM"),
  ],
  7 : [
    show("step7"),
    show("ACBLfill"),
  ],
  8 : [
    show("step8"),
    show("AKlabel"),
  ],
  9 : [
    show("step9"),
    show("AKCBfill"),
    hide("ACBLfill"),
    show("ALlabel"),
  ],
  10: [ 
    show("step10"),
    show("mua"),
    show("muaAngle"),
    hide("AKCBfill"),
  ],
  11: [ 
    show("step11"),
    show("ua"),
    show("uaAngle"),
  ],
  12: [ 
    show("step12"),
    show("OtherBetaGamma"),
  ],
  13: [
    show("step13"),
    show("ub"),
    show("uc"),
    show("mub"),
    show("muc"),
    show("mubAngle"),
    show("mucAngle"),
    show("ubAngle"),
    show("ucAngle"),
  ],
  14: [ 
    show("step14"),
    show("H"),
  ],
}
