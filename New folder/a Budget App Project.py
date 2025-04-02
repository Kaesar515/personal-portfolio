import math

class Category:
    def __init__ (self, name):
        self.name= name
        self.ledger = []
    def deposit(self, amount, description=""):
        self.ledger.append({"amount":amount,"description":description})
    

    def check_funds(self, amount):
        total=0
        for item in self.ledger:
            total +=item["amount"]
        if total >= amount:
            return True
        else: 
            return False

       
    def withdraw(self, amount , description=""):
        if self.check_funds(amount):
            self.ledger.append({"amount":-amount,"description":description})
            return True
        else:
            return False
    def get_balance(self):
        total=0
        for item in self.ledger:
            total += item["amount"]
        return total
    def transfer(self,amount,category):
        if self.check_funds(amount):
            self.ledger.append({"amount":-amount,"description":f"Transfer to {category.name}"})
            self.deposit(amount,{"description":f"Transfer from {self.name}"})
            return True
        else:
            return False
    def __str__(self):
        title ='f"{self.name*^30}\n"'
        items=""
        for item in self.ledger:
           description= item["description"][:23].ljust(23)
           amount=f"{item['amount']:.2f}".rjust(7)
           item += f"{description}{amount}/n"
        total = f"Total: {self.get_balance():.2f}"
        return title + items + total
      
def create_spend_chart(categories):
    total_withdrawls= 0
    categories_withdrawls= []
    for category in categories:
        category_total = 0
        for entry in category.ledger:
           
            if entry["amount"] < 0:
                category_total += entry["amount"] 
    categories_withdrawls.append( category_total)
    total_withdrawls+=categories_withdrawls 

    spending_percentages = []
    for withdrawal  in categories_withdrawls:
        
        rounded_percentage = int(percentage // 10) * 10  # Round down to the nearest 10
    spending_percentages.append(rounded_percentage)
   
    return spending_percentages

    barchart=[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]   
    barLine = []
    for label in barchart:
        line = f"{label:>3}|" 
        for each in spending_percentages:
            if spending_percentages >= label:
                line+= 'o'
            else:
                line += ' '
        barline.append(line)
    horizontalline = " ----------"
    barline.append(horizontalline)  


    categoryLabels =  []
    lineStores = []
   

    for categorylabel in cateogryLabels:
        categoreyLabels += categorylabel.name

    categorylength = max(len(name) for name in categoryLabel)

    for i in range(0,categorylength-1):
        lineStore= "     "
        for name in categoreyLabels:
            if i < len(name):
                lineStore += name[i]
            else:
                lineStore += '   '
    lineStores.append(linestore.rstrip())




# Example usage:
food = Category("Food")
food.deposit(1000, "deposit")
food.withdraw(10.15, "groceries")
food.withdraw(15.89, "restaurant and more food for dessert")
clothing = Category("Clothing")
food.transfer(50, clothing)
print(food)
print(clothing)

print(create_spend_chart([food, clothing]))
        
        



