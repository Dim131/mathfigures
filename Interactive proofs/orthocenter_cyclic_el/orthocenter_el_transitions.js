var transitions = {
  1 : [show("step1")],
  2 : [
    show("step2"),
    show("BE"),
    show("CZ"),
    show("H"),
    show("E"),
    show("Z"),
    show("CZA"),
    show("BEC"),
  ],
  3 : [
    show("step3"),
    show("AD"),
    show("D")
  ],
  4 : [
    show("step4"),
    show("BCEZfill"),
    show("BCEZcircle"),
    show("ZE")
  ],
  5 : [
    show("step5"),
    show("ZEB"),
    show("ZCB")
  ],
  6 : [
    show("step6"),
    hide("BCEZfill"),
    show("AEZHfill"),
    show("AEZHcircle")
  ],
  7 : [
    show("step7"),
    show("BAD"),
  ],
  8 : [
    show("step8"),
    hide("AEZHfill"),
    show("AHZ"),
    show("CHD"),
  ],
  9 : [
    show("step9"),
    show("AZHfill"),
    show("ADB"),
  ],
  10: [ 
    show("step10"),
    hide("AZHfill")
  ],
}