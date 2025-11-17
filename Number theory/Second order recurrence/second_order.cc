#include <algorithm>
#include <cmath>
#include <iostream>

// Λύση του τριωνύμου x^2 -ax + b = 0.
std::pair<double, double> get_roots(double a, double b) {
   double sqrt_D = sqrt(a*a + 4 * b);
   return { (a-sqrt_D)/2, (a + sqrt_D)/2 };
}

// Εύρεση n-οστού όρου με την 
double get_term_closed_form(double a, double b, double u0, double u1, int n) {
   auto [r1, r2] = get_roots(a, b);
   if (r1 != r2) { 
      double r1_n = std::pow(r1, n);
      double r2_n = std::pow(r2, n);
      return (r1_n - r2_n) / (r1 - r2) * u1 + (r1_n * r2 - r1 * r2_n) / (r2 - r1) * u0; 
   }
   // Διπλή ρίζα.   
   double r_n_minus_1 = std::pow(r1, n-1);
   double r_n = r_n_minus_1 * r1;
   return n * r_n_minus_1 * u1 + r_n * (1 - n) * u0;
}

// Εύρεση n-οστού όρου με επανάληψη.
double get_term_iterative(double a, double b, double u0, double u1, int n) {
   if (n == 0) return u0;
   if (n == 1) return u1;
   double un = u1, u_prev = u0;
   for (int i = 2; i <= n; ++i) {
      double u_next = a * un + b * u_prev;
      u_prev = un;
      un = u_next;
   }
   return un;
}

// Αναδρομική εύρεση n-οστού όρου.
double get_term_recursive(double a, double b, double u0, double u1, int n) {
   if (n == 0) return u0;
   if (n == 1) return u1;
   return a * get_term_recursive(a, b, u0, u1, n-1) 
      + b * get_term_recursive(a, b, u0, u1, n-2);
}

// Δομή για έναν πίνακα 2x2.
struct Matrix2D {
   double a11, a12, a21, a22;
};

// Πολλαπλασιασμός πινάκων.
Matrix2D multiply(Matrix2D x, Matrix2D y) {
   return { x.a11 * y.a11 + x.a12 * y.a21, x.a11 * y.a12 + x.a12 * y.a22, 
            x.a21 * y.a11 + x.a22 * y.a21, x.a21 * y.a12 + x.a22 * y.a22 };
}

// Εύρεση n-οστού όρου με την χρήση πινάκων.
double get_term_matrix(double a, double b, double u0, double u1, int n) {
   if (n == 0) return u0;
   // Δυαδική εκθετοποίηση πίνακα.
   Matrix2D A = { a, b, 1, 0 }, ans = {1, 0, 0, 1};
   --n;
   while (n > 0) {
      if (n % 2 == 1) ans = multiply(ans, A);
      n /= 2;
      A = multiply(A, A);
   }
   // Πολλαπλασιασμός με αρχικό διάνυσμα.
   return ans.a11 * u1 + ans.a12 * u0;
}
      

void check_fib() {
   int n = 10;
   double u0 = 0, u1 = 1;
   double a = 1.0, b = 1.0;
   for (int i = 0; i <= n; ++i) {
      std::cout << i << " : " << get_term_iterative(a, b, u0, u1, i) 
         << " vs " << get_term_recursive( a, b, u0, u1, i)
         << " vs " << get_term_closed_form(a, b, u0, u1, i)
         << " vs " << get_term_matrix(a, b, u0, u1, i)
         << std::endl;
   }
}


void check_fib2() {
   int n = 10;
   double u0 = 2, u1 = 4;
   double a = 1.0, b = 1.0;
   for (int i = 0; i <= n; ++i) {
      std::cout << i << " : " << get_term_iterative(a, b, u0, u1, i) 
         << " vs " << get_term_recursive(a, b, u0, u1, i)
         << " vs " << get_term_closed_form(a, b, u0, u1, i)
         << " vs " << get_term_matrix(a, b, u0, u1, i)
         << std::endl;
   }
}

void check_same_root() {
   int n = 10;
   double u0 = 0, u1 = 1;
   double a = 4.0, b = -4.0;
   for (int i = 0; i <= n; ++i) {
      std::cout << i << " : " << get_term_iterative(a, b, u0, u1, i) 
         << " vs " << get_term_recursive(a, b, u0, u1, i)
         << " vs " << get_term_closed_form(a, b, u0, u1, i)
         << " vs " << get_term_matrix(a, b, u0, u1, i)
         << std::endl;
   }
}


void check_same_root2() {
   int n = 10;
   double u0 = 3, u1 = 7;
   double a = 4.0, b = -4.0;
   for (int i = 0; i <= n; ++i) {
      std::cout << i << " : " << get_term_iterative(a, b, u0, u1, i) 
         << " vs " << get_term_recursive(a, b, u0, u1, i)
         << " vs " << get_term_closed_form(a, b, u0, u1, i)
         << " vs " << get_term_matrix(a, b, u0, u1, i)
         << std::endl;
   }
}

int main() {
   check_fib();

   check_fib2();

   check_same_root();
   check_same_root2();
   return 0;
}

