#include <iostream>
#include <cmath>

double sqr(double x) {
   return x * x;
}

double formula(double a1, double g1, double r, double omega, double n) {
   return a1 * g1 * (std::pow(r, n) - 1)/(r - 1) + omega * g1 * (std::pow(r, n) * ( (n -1) * r - n) + r) / sqr(r - 1);
}

int main() {
   double a1 = 0.2;
   double g1 = 0.4;
   double omega = 0.17;
   double r = 0.22;

   int n = 14;
   double total = 0.0;
   for (int i = 1; i <= 14; ++i) {
      total += (a1 + (i - 1) * omega) * g1 * std::pow(r, i-1);
   }
   std::cout << "Formula : " << formula(a1, g1, r, omega, n) << std::endl;
   std::cout << "Total : " << total << std::endl;
   return 0;
}

