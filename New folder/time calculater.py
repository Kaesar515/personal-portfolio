def add_time(start, duration,dayes=None):
    
    
    

    
    
    
    
    
    dayeslist="Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    day=0
    newPeriod=''
    newHours=0
    newdDayes=''



    
    timePart ,period = start.split()
    hours , minutes = map(int,timePart.split(':'))
        
    if period == 'PM' and hours != 12:
        hours += 12
    if period == 'AM' and hours == 12:
        hours= 0
    
    duhours, duminutes = map(int,duration.split(':'))

    
    minutes += duminutes
    if minutes >= 60:
        minutes -= 60
        hours += 1
    newminutes = "{:02}".format(minutes)
    hours += duhours
    while hours >=24:
        hours -= 24
        day += 1
    

    if hours == 12:
        newPeriod = 'PM'
        newHours = hours
    elif hours == 0:
        newPeriod = 'AM'
        newHours = 12
    elif hours > 12:
        newPeriod ='PM'
        newHours = hours -12
    else:
        newPeriod ='AM'
        newHours = hours

    
    daydes= ""    
    if dayes:
        dayindex = dayeslist.index(dayes.capitalize()) 
        numberofdayes = (day+dayindex) % len(dayeslist)
        newdDayes = dayeslist[numberofdayes] 
        daywith = f", {newdDayes}"
    else:
        daywith= ""

    
    if day == 1:
        daydes = " (next day)"
    elif day >= 2:
        daydes = f" ({day} days later)"
    else:
        daydes=""


    newTime= f"{newHours}:{newminutes} {newPeriod}{daywith}{daydes}"


    print(newTime)
    return newTime
# Test cases
add_time('3:30 PM', '2:12')
add_time('11:55 AM', '3:12')
add_time('2:59 AM', '24:00', 'saturDay') #should return '2:59 AM, Sunday (next day)'.
print("\n")

add_time('11:59 PM', '24:05') #should return '12:04 AM (2 days later)
add_time('8:16 PM', '466:02') #should return '6:18 AM (20 days later)'.
add_time('11:59 PM', '24:05', 'Wednesday') #should return '12:04 AM, Friday (2 days later)'.
add_time('8:16 PM', '466:02', 'tuesday') #should return '6:18 AM, Monday (20 days later)'.