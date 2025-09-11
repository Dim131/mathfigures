#include <iostream>

int main() {
   for (int i = 1; i <= 12; ++i) {
      std::cout << "\\tkzDrawPoints[size=1](";
      for (int j = 1; j <= 12; ++j) {
         if (i == j) continue;
         std::cout << "M" << i << "M" << j;
         if (j < 12 && !(i == 12 && j == 11)) std::cout << ",";
      }
      std::cout << ")\n";
   }

   return 0;
}

