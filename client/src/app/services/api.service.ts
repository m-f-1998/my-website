import { HttpClient, HttpHeaders } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { firstValueFrom, timeout, catchError, throwError } from "rxjs"

const REQUEST_TIMEOUT_MS = 30_000

@Injectable ( {
  providedIn: "root"
} )
export class ApiService {
  private readonly httpClient = inject ( HttpClient )

  public get<T = unknown> ( path: string ): Promise<T> {
    return firstValueFrom (
      this.httpClient.get<T> ( path ).pipe (
        timeout ( REQUEST_TIMEOUT_MS ),
        catchError ( err => this.handleTimeout ( err ) )
      )
    )
  }

  public post<T = unknown> ( path: string, body: Record<string, unknown> = { } ): Promise<T> {
    const headers = new HttpHeaders ( { "Content-Type": "application/json" } )

    return firstValueFrom (
      this.httpClient.post<T> ( path, body, { headers } ).pipe (
        timeout ( REQUEST_TIMEOUT_MS ),
        catchError ( err => this.handleTimeout ( err ) )
      )
    )
  }

  private handleTimeout ( err: unknown ) {
    if ( ( err as { name?: string } )?.name === "TimeoutError" ) {
      return throwError ( ( ) => ( { error: { message: "Request timed out. Please try again." } } ) )
    }

    return throwError ( ( ) => err )
  }
}
