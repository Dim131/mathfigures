#include <iostream>
#include <cmath>

double sqr(double x) {
   return x * x;
}

double formula(double r, double n) { 
   return (std::pow(r, n) * ( (n-1) * r - n) + r) / sqr(r-1);
}

int main() {
   int n = 12;
   double r = 0.3;
   std::cout << "Formula : " << formula(r, n) << std::endl;

   double cur_pow = 1;
   double total = 0.0;
   for (int k = 1; k <= n - 1; ++k) {
      cur_pow *= r;
      total += k * cur_pow;
   }
   std::cout << "BF : " << total << std::endl;
   return 0;
}

