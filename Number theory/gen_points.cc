#include <iostream>

void gen_point1(int t) {
   int x = 3 + 8 * t;
   int y = -13 -35 * t;
   if (35 * x + 8* y != 1) std::cout << "ERROR" << std::endl;
   std::cout << "(" << x << ", " << y << ")" << std::endl;
}

void gen_point2(int t) {
   int x = 9 + 8 * t;
   int y = -39 -35 * t;
   if (35 * x + 8* y != 3) std::cout << "ERROR" << std::endl;
   std::cout << "(" << x << ", " << y << ")" << std::endl;
}

int main() {
   for (int i = -6; i <= 5; ++i) {
      gen_point1(i);
   }
   for (int i = -7; i <= 5; ++i) {
      gen_point2(i);
   }
   return 0;
}

   
