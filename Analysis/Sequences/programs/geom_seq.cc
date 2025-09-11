#include <iostream>

int main() {
   double a_1 = 2.0;
   double lambda = 3.0;
   
   double a_n = a_1;
   for (int n = 1; n <= 5; ++n) {
     std::cout << "a_" << n << " = " << a_n << ", ";
     a_n = a_n * lambda; // Υπολογισμός επόμενου όρου.
   }
   return 0;
}

