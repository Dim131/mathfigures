#include <iostream>
#include <vector>

void enumerate(const std::vector<char>& A) {
   int k = 2;
   int n = A.size();

   std::vector<int> pos(k, 0);
   while(true) {
      for (int i = 0; i < k; ++i) {
         ++pos[i];
         if (pos[i] < n) break;
         pos[i] = 0;
         if (i == k - 1) return;
      }
      for (int i = k - 1; i >= 0; --i) {
         std::cout << A[pos[i]];
      }
      std::cout << std::endl;
   }
}

int main() {
   std::vector<char> A = {'a', 'b', 'c', 'd'};
   enumerate(A);
   return 0;
}


