import api from "../../../apis/axios";

export const fetchClasses = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const schoolId = user?.schoolId;

  return api.get(`/api/classes?schoolId=${schoolId}`);
};
