#include <iostream>

int gcd(int n, int m) {
   std::cout << n << " = " << m << " * " << (n/m) << " + " << (n % m) << std::endl;
   if (n % m == 0) return m;
   return gcd(m, n % m);
}

int main() {
   std::cout << gcd(350, 120) << std::endl;
   std::cout << gcd(121798, 21372) << std::endl;
   std::cout << gcd(144, 2584) << std::endl;
   std::cout << gcd(175, 40) << std::endl;
   return 0;
}

