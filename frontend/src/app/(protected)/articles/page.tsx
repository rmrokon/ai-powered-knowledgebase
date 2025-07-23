export default function Articles(){
    return <div className="bg-background">
        <h3 className="text-foreground">These are articles</h3>
        <div className="p-4 bg-base-background text-base-foreground">
      <div className="p-4 bg-primary text-primary-foreground rounded-lg mb-4">
        Primary color test
      </div>
      <div className="p-4 bg-secondary text-secondary-foreground rounded-lg mb-4">
        Secondary color test
      </div>
      <div className="p-4 bg-muted text-muted-foreground border border-border rounded-lg">
        Muted color test
      </div>
    </div>
    </div>
}