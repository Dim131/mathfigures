

## Steps to generate step-by-step proof:
 1. Run the command:
    ```
    latex orthocenter_en.tex
    ```
    This will generate the `.dvi` file. **Note:** Don't worry if your dvi viewer cannot display this file.
 2. Run the command:
    ```
    dvisvgm --no-fonts --linkmark=none orthocenter_en.dvi
    ```
    This will generate the `.svg` file without any animations. **Note:** You can open this file on any browser.
 3. Generate the transitions table for your step by step proof. For example,
    ```
    var transitions = {
       1 : [
         show("step1")
       ],
       2 : [
         show("step2"),
         show("BE"),
         show("CZ"),
      ],
      3 : [
         show("step3"),
         hide("CZ")
         show("AD"),
         show("D")
      ],
    }
    ```
 4. Open `svg_generator.html`, enter your transition code and the svg code and click *Generate*. The output svg will appear on the right. Click *copy* to copy the code on clipboard. 
    
    **Note:** You may need to adjust the position of the arrows, so that they become visible.


## How does it work? (roughly)

* The LaTeX commands add ids to the generated svg elements (through the dvi engine).
* The ``svg_generator`` adds one *prev* and one *next* button for each of the transitions that exists. When either button is clicked the elements with appropriate ids are hidden/shown. 

  The generator uses the SVG SMIL language (and not js). For example, the following code states that when the second next button is clicked, the element with id ``ABCfill`` will appear:
  ```
  <set xlink:href="#ABCfill" attributeType="XML" attributeName="visibility" to="visible" begin="next2.click"></set>
  ```
  The generated code is added just before the last ``</g>`` in the `.svg` file. (Usually this is the third line from the end of the file.