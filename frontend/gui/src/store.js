//Uncomment this on local development (LOCAL)
const baseURL = "http://127.0.0.1:8000";

export const BEARERTOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM2NzMyNDg5LCJqdGkiOiIzZTIyNzAxZTFiMTM0NjQ1OWE0NTM1MDA0OTc0YmRmYyIsInVzZXJfaWQiOjF9.NIfUgODJ92AvXdh3ipPhrYqHlv7hfntMODG6epo7g_0";

//Uncomment this on server development  (SERVER)
// const baseURL = "http://127.0.0.1:8000";
// export const BEARERTOKEN =
//   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM2NzMyNDg5LCJqdGkiOiIzZTIyNzAxZTFiMTM0NjQ1OWE0NTM1MDA0OTc0YmRmYyIsInVzZXJfaWQiOjF9.NIfUgODJ92AvXdh3ipPhrYqHlv7hfntMODG6epo7g_0";

const apiURL = "/api";

export const URL = `${baseURL}${apiURL}`;

export const buildings = `${URL}/buildings/`;
export const buildingDetail = (id) => `${URL}/buildings/${id}/`;
export const contacts = `${URL}/contacts/`;
export const searchBuilding = (param) => `${URL}/buildings/?search=${param}`;
export const addBooking = `${URL}/add-booking/`;
export const login = `${URL}/login_user/`;
export const register = `${URL}/register_user/`;
export const countTotals = (buildingId, key) =>
  `${URL}/count-totals/${buildingId}/${key}/`;
export const addFloor = `${URL}/add-floor/`;
export const buildingFloors = (id) => `${URL}/floors/${id}/`;
export const addBlock = `${URL}/add-block/`;
export const buildingBlocks = (id) => `${URL}/blocks/${id}/`;
export const addRoom = `${URL}/add-room/`;
export const floorDetail = (id) => `${URL}/floor-details/${id}/`;
// export const deleteFloor = (id) => `${URL}/floor-details/${id}/`;
export const blockDetail = (id) => `${URL}/block-details/${id}/`;
export const deleteBlock = (id) => `${URL}/block-details/${id}/`;
export const buildingRooms = (id) => `${URL}/rooms/${id}/`;
export const roomDetail = (id) => `${URL}/room-details/${id}/`;
export const deleteRoom = (id) => `${URL}/room-details/${id}/`;
export const bookingDetail = (id) => `${URL}/booking-details/${id}/`;
export const pendingBookings = (id) => `${URL}/pending-bookings/${id}/`;
export const buildingTenants = (id) => `${URL}/tenants/?building_id=${id}`;
export const tenantDetail = (tenantId, buildingId) =>
  `${URL}/tenants/${tenantId}/?building_id=${buildingId}`;
export const addBill = `${URL}/billings/`;
export const billingDetail = (billingId, buildingId) =>
  `${URL}/billings/${billingId}/?building_id=${buildingId}`;
export const billings = (buildingId) =>
  `${URL}/billings/?building_id=${buildingId}`;
export const addTenant = `${URL}/tenants/`;
