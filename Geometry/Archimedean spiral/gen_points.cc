#include <iostream>

int main() {
   for (int i = 1; i <= 12; ++i) {
      for (int j = 1; j <= 12; ++j) {
         std::cout << "\\tkzDefPointOnLine[pos=" << j << "/12](O,P" << i << ")\\tkzGetPoint{M" << i << "M" << j << "}\n";
      }
   }

   return 0 ;
}
