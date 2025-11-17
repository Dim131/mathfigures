#include <iostream>

using namespace std;

pair<int, int> euclidean_division(int D, int d) {
   int P = 0;
   int pow10 = 1;
   while (d * pow10 <= D) pow10 *= 10; 
   int u = D;
   while (u >= d) {
      int digit = 0;
      while ((digit + 1) * pow10 * d <= u) {
         digit = digit + 1;
      }
      u -= digit * pow10 * d;
      P += digit * pow10;
      pow10 /= 10;
   }
   return {P, u};
}

int main() {
   auto [P, u] = euclidean_division(127352, 782);
   std::cout << P << ", " << u << std::endl;
   auto [P1, u1] = euclidean_division(127352, 127352);
   std::cout << P1 << ", " << u1 << std::endl;
   return 0;
}


