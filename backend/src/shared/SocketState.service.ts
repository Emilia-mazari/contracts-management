import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class SocketStateService{
    private socketState = new Map<string,Socket[]>()

    add(userId:string, socket:Socket){
        const sockets:Socket[] = this.socketState.get(userId) || [];

        this.socketState.set(userId,[...sockets,socket]);
        return true;

    }
     remove(userId: string, socket: Socket): boolean {
        const sockets = this.socketState.get(userId)

        if (!sockets) {
          return true
        }
     
        const newSockets = sockets.filter(s => s.id !== socket.id)
     
        if (!newSockets.length) {
          this.socketState.delete(userId)
        } else {
          this.socketState.set(userId, newSockets)
        }
     
        return true
    }
    get(userId:string){
        return this.socketState.get(userId) ||[];
    }
    public getAll(): Socket[] {
        const all = []
        this.socketState.forEach(sockets => all.push(sockets))
        return all;
      }
}