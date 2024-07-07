import axios from 'axios';

class Hotel {
  static async getRoomOptions() {
    const response = await axios.get('https://bot9assignement.deno.dev/rooms');
    return response.data;
  }

  static async bookRoom(roomId: number, fullName: string, email: string, nights: number) {
    const response = await axios.post('https://bot9assignement.deno.dev/book', {
      roomId,
      fullName,
      email,
      nights,
    });
    return response.data;
  }
}

export default Hotel;
