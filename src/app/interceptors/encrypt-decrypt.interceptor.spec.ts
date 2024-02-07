import { TestBed } from '@angular/core/testing';

import { EncryptDecryptInterceptor } from './encrypt-decrypt.interceptor';

describe('EncryptDecryptInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EncryptDecryptInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: EncryptDecryptInterceptor = TestBed.inject(EncryptDecryptInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
