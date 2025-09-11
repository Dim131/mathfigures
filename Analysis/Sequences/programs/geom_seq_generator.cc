#include <iostream>

int main() {
   double a1 = 10.0;
   double lambda = 0.5;

   double prev = a1;

   for (int i = 1; i <= 10; ++i) {
      std::cout << "(" << i << ", " << prev << ")" << std::endl;
      prev *= lambda;
   }

   return 0;
}

