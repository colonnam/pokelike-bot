export interface BotConfig {
  target: string;
  shinyOnly: boolean;
  openDelay: number;
}

export const CONFIG: BotConfig = {
  target: "",
  shinyOnly: true,
  openDelay: 1,
};
