#include <iostream>
#include <set>

int main() {
   std::cout << "Enter the number of sides" << std::endl;
   int num_sides, step;

   std::cin >> num_sides;
   std::cout << "Enter the step size:" << std::endl;
   std::cin >> step;

   int cur = 0;
   for (int i = 0; i < num_sides; ++i) {
      std::cout << "P" << (cur+1) << ",";
      cur = (cur + step) % num_sides;
   }

   return 0;
}

