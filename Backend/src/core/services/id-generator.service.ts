import { injectable } from 'inversify';

@injectable()
export class IdGeneratorService {
  private allowedCharacters: string;

  constructor() {
    this.allowedCharacters = '';
    var lowerCaseLetters = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 97));
    var upperCaseLetters = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65));
    var numbers = Array.from({ length: 10 }, (v, i) => i.toString());
    lowerCaseLetters.forEach((letter) => (this.allowedCharacters = this.allowedCharacters.concat(letter)));
    upperCaseLetters.forEach((letter) => (this.allowedCharacters = this.allowedCharacters.concat(letter)));
    numbers.forEach((number) => (this.allowedCharacters = this.allowedCharacters.concat(number)));
  }

  public generateAdminId(): string {
    var allowedCharactersLength = this.allowedCharacters.length;
    var keyPars = new Array<string>();
    keyPars.push("ad");

    for (var part = 0; part < 4; part++) {
      var keyPart = '';

      for (var character = 0; character < 5; character++) {
        var keyChar = this.allowedCharacters[this.getRandomNumberInclusive(0, allowedCharactersLength - 1)];
        keyPart = keyPart.concat(keyChar);
      }

      keyPars.push(keyPart);
    }

    return keyPars.join('-');
  }

  public generateUserId(): string {
    var allowedCharactersLength = this.allowedCharacters.length;
    var keyPars = new Array<string>();
    keyPars.push("us");

    for (var part = 0; part < 4; part++) {
      var keyPart = '';

      for (var character = 0; character < 5; character++) {
        var keyChar = this.allowedCharacters[this.getRandomNumberInclusive(0, allowedCharactersLength - 1)];
        keyPart = keyPart.concat(keyChar);
      }

      keyPars.push(keyPart);
    }

    return keyPars.join('-');
  }

  private getRandomNumberInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
