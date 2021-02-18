
const time = (function (){
  const endOfDay = () => {
    const now = new Date();
    return new Date(now.getFullYear()
              ,now.getMonth()
              ,now.getDate()
              ,23,59,59);
  }

  const startOfDay = () => {
    const day = new Date()
    day.setHours(0, 0, 0, 0);
    return day;
  }

  const oneWeek = () => {
    return new Date(Number(endOfDay()) + 614800000);
  }

  const getDateStyle = (due) => {
    due = Number(due);
    if(due === 0) return false;
    if (due > startOfDay() && due < endOfDay()) {
      return 'due-today';
    } else if (due < startOfDay()) {
      return 'overdue';
    } else if (due < new Date(startOfDay().getTime() + 614800000)) {
      return 'soon';
    }
    return false;
  }

  return {
    endOfDay,
    startOfDay,
    oneWeek,
    getDateStyle,
  }
})()

export { time as default };