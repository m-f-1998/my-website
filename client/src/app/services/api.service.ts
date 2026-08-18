import { HttpClient, HttpHeaders } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { firstValueFrom } from "rxjs"

@Injectable ( {
  providedIn: "root"
} )
export class ApiService {
  private readonly httpClient = inject ( HttpClient )

  public get<T = unknown> ( path: string ): Promise<T> {
    return firstValueFrom (
      this.httpClient.get<T> ( path )
    )
  }

  public post<T = unknown> ( path: string, body: Record<string, unknown> = { } ): Promise<T> {
    const headers = new HttpHeaders ( { "Content-Type": "application/json" } )

    return firstValueFrom (
      this.httpClient.post<T> ( path, body, { headers } )
    )
  }
}
