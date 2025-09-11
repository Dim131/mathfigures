#include <cmath>
#include <iomanip>
#include <iostream>

const double PI = M_PI;

int main() {
   std::cout << std::fixed;
   std::cout << std::setprecision(6);
   for (int i = 3; i <= 20; ++i) {
      double area_R = 0.5 * i * sin(2 * PI / double(i));
      double rel_err1 = area_R / PI;
      double area_r = i * tan(PI / double(i));
      double rel_err2 = area_r / PI;
      std::cout << "| " << i << "||<math></math> || " << area_R << " || " << rel_err1
         << " || <math></math> || " << area_r << " || " << rel_err2 << std::endl << "|-" << std::endl;
   }
  return 0;
}

