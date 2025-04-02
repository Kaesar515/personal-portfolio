def add_time(start, duration, dayes=None):
    # Parse start time
    time_part, period = start.split()
    hours, minutes = map(int, time_part.split(':'))

    # Convert start time to 24-hour format
    if period == 'PM' and hours != 12:
        hours += 12
    if period == 'AM' and hours == 12:
        hours = 0
    
    # Parse duration time
    duhours, duminutes = map(int, duration.split(':'))

    # Add duration to start time
    minutes += duminutes
    if minutes >= 60:
        minutes -= 60
        hours += 1
    
    hours += duhours
    days_later = 0
    if hours >= 24:
        days_later = hours // 24
        hours = hours % 24

    # Convert back to 12-hour format
    if hours == 0:
        new_period = 'AM'
        new_hours = 12
    elif hours < 12:
        new_period = 'AM'
        new_hours = hours
    elif hours == 12:
        new_period = 'PM'
        new_hours = 12
    else:
        new_period = 'PM'
        new_hours = hours - 12

    # Handle the optional day of the week
    if dayes:
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        day_index = days_of_week.index(dayes.capitalize())
        new_day_index = (day_index + days_later) % 7
        new_day = days_of_week[new_day_index]
        day_string = f", {new_day}"
    else:
        day_string = ""

    # Determine days later string
    if days_later == 1:
        days_later_string = " (next day)"
    elif days_later > 1:
        days_later_string = f" ({days_later} days later)"
    else:
        days_later_string = ""

    # Construct the final time string
    new_time = f"{new_hours}:{minutes:02d} {new_period}{day_string}{days_later_string}"
    
    # Print the final time string inside the function
    print(new_time)

    return new_time

# Directly call the function at the end
add_time('3:00 PM', '3:10')
add_time('2:59 AM', '24:00')
add_time('2:59 AM', '24:00', 'saturDay')