#include <iostream>

int main() {
   double a1 = 2.0;
   double omega = 3.0;
   double c1 = 1.0;
   double lambda = 2.0;
   
   double lambda_n = 1.0;
   for (int n = 1; n <= 5; ++n) {
     double cur = (a1 + (n-1) * omega) * c1 * lambda_n;
     lambda_n *= lambda;
     std::cout << "b_" << n << " = " << cur << ", ";
   }
   return 0;
}
/* Τυπώνει: b_1 = 2, b_2 = 10, b_3 = 32, b_4 = 88, b_5 = 224, ... */

