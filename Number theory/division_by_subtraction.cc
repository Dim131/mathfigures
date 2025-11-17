#include <iostream>

using namespace std;

pair<int, int> euclidean_division(int D, int d) {
   int P = 0;
   int u = D;
   while (u >= d) {
      P = P + 1;
      u = u - d;
   }
   return {P, u};
}

int main() {
   auto [P, u] = euclidean_division(127352, 782);
   std::cout << P << ", " << u << std::endl;
   auto [P1, u1] = euclidean_division(782, 782);
   std::cout << P1 << ", " << u1 << std::endl;
   return 0;
}


