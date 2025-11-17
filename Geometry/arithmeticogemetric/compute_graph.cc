#include <iostream>

int main() {
   double a1 = 2.0;
   double omega = 1.0;
   double c1 = 1.0;
   double lambda = 3.0;
   
   double lambda_n = 1.0;
   for (int n = 1; n <= 10; ++n) {
     double cur = (a1 + (n-1) * omega) * c1 * lambda_n;
     lambda_n *= lambda;
     std::cout << "(" << n << ", " << cur << ")" << std::endl;
   }
   return 0;
}
/* Τυπώνει: b_1 = 2, b_2 = 12, b_3 = 54, b_4 = 216, b_5 = 810, */

