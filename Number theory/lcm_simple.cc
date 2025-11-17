#include <iostream>

int lcm_set(int a, int b) {
   int pol_a = a;
   int pol_b = b;
   while (pol_a != pol_b) {
      if (pol_a < pol_b) pol_a = pol_a + a;
      else pol_b = pol_b + b;
   }
   return pol_a;
}

int main() {
   std::cout << lcm_set(90, 24) << std::endl;
   std::cout << lcm_set(24, 90) << std::endl;
   return 0;
}

