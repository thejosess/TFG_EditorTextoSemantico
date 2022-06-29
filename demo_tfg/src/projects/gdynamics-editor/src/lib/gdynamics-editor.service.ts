import { Step } from 'prosemirror-transform';
import { BehaviorSubject, debounceTime, Observable, Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { pendingSteps } from './types/types';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private pendindingSteps: pendingSteps[] = [];
  private documentSubject: Subject<void>;


  constructor(private http: HttpClient) {
    this.documentSubject = new Subject<void>();
    this.http = http
    this.documentSubject.asObservable()
    // TODO: descomentar para aplicar el debounce
    // .pipe(debounceTime(1000))
    // .subscribe(() => {
    //   // send pendingSteps to express server
    //   console.log(this.pendindingSteps);
    //   this.pendindingSteps.forEach(pendingStep => {

    //     let resultSteps = []
    //     let body = {
    //       content: pendingStep.doc,
    //       steps: pendingStep.steps,
    //     }
    //     console.log('hacemos peticion al server para actualizar', body)
    //     http.put<any>(
    //       `http://localhost:8000/content/62a0d6abc13030cfc2aa9eac/doc`,
    //       pendingStep).subscribe({
    //         next: data => {
    //           console.log('Send steps...')
    //         },
    //         error: error => {
    //           console.error('There was an error sending  steps!', error);
    //         }
    //       })
    //   });
    //   // reiniciamos los steps
    //   this.pendindingSteps = [];

    // });
  }

  loadDoc(docId: String) {
    return this.http.get<any>(`http://localhost:8000/content/${docId}/doc`);
  }

  updateSteps(docId: String, steps: pendingSteps) {
    // this.pendindingSteps = this.pendindingSteps.concat(steps);
    // this.documentSubject.next();
    console.log('Enviando steps al servidor desde service...')
    //this.http.get<Step[]>(`http://localhost:8000/content/${docId}/doc`);
    return this.http.put<any>(
      `http://localhost:8000/content/${docId}/doc`,
      steps)
  }

  saveNewVersion(docId: String) {
    console.log('Llamando al server para nueva version')
    return this.http.put<any>(
      `http://localhost:8000/content/${docId}/new_version`, {})
  }


  // updateDoc(docId, ...) {
  //   this.http.put<any>(
  //     'http://localhost:8000/content/62a0d6abc13030cfc2aa9eac/doc',
  //     body)
  //     .subscribe({
  //       next: data => {
  //         console.log('udapte doc...')
  //         this.render();
  //       },
  //       error: error => {
  //         console.error('There was an error!', error);
  //       }
  //     })
  // }
}