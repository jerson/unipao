import Schedule from './intranet/Schedule';
import Note from './intranet/Note';
import Enrollment from './intranet/Enrollment';
import Course from './intranet/Course';

const TAG = 'Intranet';
export default class Intranet {
  static Course = Course;
  static Enrollment = Enrollment;
  static Note = Note;
  static Schedule = Schedule;

  static async getPayments() {}

  static async getLevels() {}

  static async getCourses(period: string, level: string) {}

  static async getPeriods() {}
}
