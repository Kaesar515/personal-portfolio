
def arithmetic_arranger(problems, showAnswers=False):
    if len(problems) > 5:
        return 'Error: Too many problems.'
    
    topline =[]
    secline = []
    dashesline = []
    answerline = []

    for problem in problems:
        components = problem.split()
        operand1 = components[0]
        operator = components[1]
        operand2 = components[2]

        if operator not in ['+', '-']:
            return "Error: Operator must be '+' or '-'."
       
        if not operand1.isdigit() or not operand2.isdigit():
            return 'Error: Numbers must only contain digits.'
        
        if len(operand1) > 4 or len(operand2) >4:
            return 'Error: Numbers cannot be more than four digits.'
        
        width= max(len(operand1),len(operand2))+2
        
        top = operand1.rjust(width)
        bottom = operator + ' ' + operand2.rjust(width - 2)
        dashes = '-' * width

        topline.append(top)
        secline.append(bottom)
        dashesline.append(dashes)
        
        if showAnswers:
            if operator == '+':
                answer =str(int(operand1) + int(operand2))
            else:
                answer= str(int(operand1) - int(operand2))
            ans = answer.rjust(width)
            answerline.append(ans)

    arrangedTop = '    '.join(topline)
    arrangedSec ='    '.join(secline)
    arrangedDashes= '    '.join(dashesline)

    if showAnswers:
        arrangedAnswer= '    '.join(answerline)
        arrangedProblem = arrangedTop + '\n' +arrangedSec + '\n' + arrangedDashes+ '\n'+ arrangedAnswer
    else:
        arrangedProblem = arrangedTop + '\n' +arrangedSec + '\n' + arrangedDashes 

    return arrangedProblem
print(arithmetic_arranger(["3 + 855", "988 + 40"], True))

        

