#include <iostream>

int main() {
   int num_sides, skips;
   std::cin >> num_sides;
   std::cin >> skips;
   //num_sides << std::cin;
   // skips << std::cin;
   int num = 180 * (num_sides - 2 * skips);
   std::cout << "Mixed ratio:" << std::endl;
   std::cout << num / num_sides << std::endl;
   std::cout << num % num_sides << "/" << num_sides << std::endl;
   std::cout << "FP: " << num / double(num_sides) << std::endl;
   std::cout << "Radians: " << (num_sides - 2 * skips) << "/" << num_sides;

   return 0;
}


